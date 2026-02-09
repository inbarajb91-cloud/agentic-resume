'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import console from 'console'
import { revalidatePath } from 'next/cache'
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function parseAndSaveResume(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file uploaded')

    // 1. Extract Text
    let text = ''
    if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const data = await pdf(buffer)
        text = data.text
    } else {
        text = await file.text()
    }

    // 2. Parse with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
    You are an expert resume parser. Extract the following information from the resume text below and return a JSON array of experience items.
    
    The output must be a valid JSON array where each object has the following structure:
    {
      "type": "work" | "education" | "project" | "skill",
      "title": "Job Title or Degree or Project Name",
      "organization": "Company or University Name (null for skills)",
      "start_date": "YYYY-MM-DD" (or null if not found),
      "end_date": "YYYY-MM-DD" (or null if "Present"),
      "description_raw": "The full description bullet points"
    }

    Resume Text:
    ${text}
  `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim()

    let parsedData
    try {
        parsedData = JSON.parse(jsonString)
    } catch (e) {
        console.error("Failed to parse Gemini response", jsonString)
        throw new Error("Failed to parse resume with AI")
    }

    // 3. Save to Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const itemsToInsert = parsedData.map((item: any) => ({
        ...item,
        user_id: user.id,
        source_file: file.name
    }))

    const { error } = await supabase.from('experience_vault').insert(itemsToInsert)

    if (error) {
        console.error("Supabase Insert Error", error)
        throw new Error(error.message)
    }

    revalidatePath('/dashboard/vault')
    return { success: true, count: itemsToInsert.length }
}
