// src/app/api/admin/check-session/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  
  return NextResponse.json({
    isAuthenticated: session?.value === 'authenticated',
    sessionId: session?.value
  });
}