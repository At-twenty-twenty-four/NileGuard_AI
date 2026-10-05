import { NextResponse } from 'next/server';

// Types for threat analysis
interface ThreatAnalysisRequest {
  type: 'malware' | 'intrusion' | 'phishing';
  data: Record<string, any>;
}

const PYTHON_AI_SERVICE = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const body: ThreatAnalysisRequest = await request.json();

    if (!body.type || !body.data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let endpoint = '';
    let analysisData = body.data;

    switch (body.type) {
      case 'malware':
        endpoint = `${PYTHON_AI_SERVICE}/analyze/malware`;
        break;
      case 'intrusion':
        endpoint = `${PYTHON_AI_SERVICE}/analyze/intrusion`;
        break;
      case 'phishing':
        endpoint = `${PYTHON_AI_SERVICE}/analyze/phishing`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid threat type' },
          { status: 400 }
        );
    }

    // Call Python AI service
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analysisData),
    });

    if (!response.ok) {
      throw new Error(`AI Service error: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      type: body.type,
      analysis: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Threat analysis error:', error);
    return NextResponse.json(
      { error: 'Threat analysis failed' },
      { status: 500 }
    );
  }
}
