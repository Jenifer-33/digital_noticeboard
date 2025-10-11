import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import type { Headline } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const data: Omit<Headline, 'id' | 'created_date' | 'modified_date'> = await request.json()
    
    const { data: headline, error } = await supabaseAdmin
      .from('headlines')
      .insert({
        ...data,
        created_date: new Date().toISOString(),
        modified_date: new Date().toISOString(),
        published_date: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
        auto_publish_date: data.auto_publish_date && data.auto_publish_date.trim() !== '' 
          ? new Date(data.auto_publish_date).toISOString() 
          : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Headline creation error:', error)
      return NextResponse.json({ error: 'Failed to create headline', details: error.message }, { status: 500 })
    }

    return NextResponse.json(headline)
  } catch (error) {
    console.error('Headline creation catch error:', error)
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
