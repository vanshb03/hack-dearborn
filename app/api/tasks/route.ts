import { supabase } from '@/app/utils/createSupaBaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { user_id, title, estimated_duration } = await request.json();

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id, title, estimated_duration, status: 'pending' }])
      .select('*');

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*');

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}