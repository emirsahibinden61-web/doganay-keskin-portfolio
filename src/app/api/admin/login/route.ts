import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    // Required admin password: Dogi5461.
    if (password === 'Dogi5461.') {
      const response = NextResponse.json({ success: true, message: 'Giriş başarılı' });
      // Set secure cookie
      response.cookies.set('doganay_admin_auth', 'authenticated_session_dogi5461', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Geçersiz şifre! Lütfen şifrenizi kontrol edin.' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
