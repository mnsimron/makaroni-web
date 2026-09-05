import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Ambil header otorisasi
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    
    // Gunakan atob() untuk Edge Runtime, JANGAN gunakan Buffer
    const decodedValue = atob(authValue);
    const [user, pwd] = decodedValue.split(':');

    const validUser = process.env.ADMIN_USERNAME;
    const validPwd = process.env.ADMIN_PASSWORD;

    // Jika username dan password cocok, izinkan masuk
    if (user === validUser && pwd === validPwd) {
      return NextResponse.next();
    }
  }

  // Jika gagal atau belum login, munculkan pop-up browser
  return new NextResponse('Akses Ditolak: Masukkan Username dan Password.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Halaman Admin makar-oni"',
    },
  });
}

// Hanya jalankan middleware ini untuk halaman /admin dan sub-halamannya
export const config = {
  matcher: ['/admin/:path*'],
};