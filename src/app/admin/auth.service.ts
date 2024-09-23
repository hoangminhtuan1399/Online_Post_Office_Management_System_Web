import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // Lấy token từ cookie
  getTokenFromCookies(): string | null {
    const name = 'jwt=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        const token = c.substring(name.length, c.length);
        console.log('Token retrieved from cookie:', token); // Log để kiểm tra
        return token;
      }
    }
    return null;
  }

  // Lưu dữ liệu người dùng và token vào localStorage và cookie
  setUserData(data: any) {
    if (data.token) {
      document.cookie = `jwt=${data.token};path=/`;
      localStorage.setItem('username', data.username);
      localStorage.setItem('userRole', data.roleName);
      localStorage.setItem('userId', data.id);
    } else {
      console.error('No token provided in the user data.');
    }
  }

  // Đăng xuất, xóa token và dữ liệu người dùng
  signOut() {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }
}
