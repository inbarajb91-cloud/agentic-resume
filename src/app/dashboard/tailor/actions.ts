'use server'

import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function createTailoredResume(prevState: any, formData: FormData) {
    const jobTitle = formData.get('jobTitle') as string
    const jobDescription = formData.get('jobDescription') as string

    if (!jobTitle || !jobDescription) {
        return { error: 'Please fill in all fields' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Fetch Master Record
    const { data: experiences } = await supabase
        .from('experience_vault')
        .select('*')
        .eq('user_id', user.id)

    if (!experiences || experiences.length === 0) {
        return { error: 'Your vault is empty. Please add experience first.' }
    }

    // 2. Generate Tailored Content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `
    You are an expert resume writer.
    
    JOB TITLE: ${jobTitle}
    
    JOB DESCRIPTION:
    ${jobDescription}

    CANDIDATE EXPERIENCE (Master Record):
    ${JSON.stringify(experiences)}

    TASK:
    1. Select the most relevant experience items from the Master Record.
    2. Rewrite the bullet points to use the STAR method and match the keywords in the Job Description.
    3. Generate a "Match Score" (0-100) based on how well the candidate fits the role.
    4. Return a JSON object with this structure:
    {
      "tailored_experiences": [
        {
          "original_id": "uuid of the original item",
          "title": "Tailored Title",
          "organization": "Organization",
          "start_date": "YYYY-MM-DD",
          "end_date": "YYYY-MM-DD",
          "bullets": ["Optimized bullet 1", "Optimized bullet 2"]
        }
      ],
      "match_score": 85,
      "summary": "A brief professional summary tailored to this role."
    }
  `

    let tailoredContent
    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim()
        tailoredContent = JSON.parse(jsonString)
    } catch (e) {
        console.error(e)
        return { error: 'AI Generation failed. Please try again.' }
    }

    // 3. Save to Supabase
    // Generate a random slug for the public view
    const slug = `${jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`

    const { data: resume, error } = await supabase.from('tailored_resumes').insert({
        user_id: user.id,
        job_title_target: jobTitle,
        job_description_input: jobDescription,
        slug: slug,
        content: tailoredContent,
        match_score: tailoredContent.match_score,
        is_public: true
    }).select().single()

    if (error) {
        console.error(error)
        return { error: 'Failed to save resume.' }
    }

    redirect(`/dashboard/tailor/${resume.id}`)
}
