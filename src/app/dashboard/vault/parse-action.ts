'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import console from 'console'
import { revalidatePath } from 'next/cache'
// @ts-ignore
// @ts-ignore
const pdf = require('pdf-parse')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function parseAndSaveResume(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file uploaded')

    // 1. Extract Text
    let text = ''
    console.log(`[Parse Action] Start. File: ${file.name}, Size: ${file.size}, Type: ${file.type}`)

    try {
        if (file.type === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            console.log('[Parse Action] Buffer created. Calling pdf-parse...')
            const data = await pdf(buffer)
            text = data.text
            console.log(`[Parse Action] PDF parsed. Text length: ${text.length}`)
        } else {
            text = await file.text()
            console.log(`[Parse Action] Text file read. Length: ${text.length}`)
        }
    } catch (error) {
        console.error('[Parse Action] Text extraction failed:', error)
        throw new Error('Failed to extract text from file. Is it a valid PDF?')
    }

    if (!text || text.trim().length < 50) {
        throw new Error('Could not extract enough text from resume. Is it a scanned image?')
    }

    // 2. Parse with Gemini
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set')
    }
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

    let parsedData
    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim()
        parsedData = JSON.parse(jsonString)

        if (!Array.isArray(parsedData)) {
            throw new Error('Response is not an array')
        }
    } catch (e) {
        console.error("Failed to parse Gemini response or execute model", e)
        throw new Error("Failed to parse resume with AI. Please try again.")
    }

    // 3. Save to Supabase
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) throw new Error('Unauthorized')

    const itemsToInsert = parsedData.map((item: any) => ({
        ...item,
        user_id: user.id,
        source_file: file.name
    }))

    const { error } = await supabase.from('experience_vault').insert(itemsToInsert)

    if (error) {
        console.error("Supabase Insert Error", error)
        throw new Error(`Database Error: ${error.message}`)
    }

    revalidatePath('/dashboard/vault')
    return { success: true, count: itemsToInsert.length }
}
