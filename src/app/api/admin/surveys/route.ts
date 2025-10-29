// src/app/api/admin/surveys/route.ts

import { NextRequest } from 'next/server';
import { adminDatabase } from '@/lib/database/admin-db';
import { isAdminAuthenticated } from '@/lib/admin/auth';

export async function GET(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const surveyId = searchParams.get('surveyId');
  
  try {
    const responses = adminDatabase.getSurveyResponses(surveyId || undefined);
    return Response.json({ responses });
  } catch (error) {
    return Response.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    const response = adminDatabase.createSurveyResponse({
      id: `RESP-${Date.now()}`,
      ...data,
      submittedAt: new Date().toISOString()
    });
    return Response.json(response);
  } catch (error) {
    return Response.json({ error: 'Failed to create response' }, { status: 500 });
  }
}