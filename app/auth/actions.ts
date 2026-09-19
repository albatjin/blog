'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type AuthState = {
  success?: boolean
  error?: string
  message?: string
}

export async function signInAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해 주세요.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: '이메일 인증이 완료되지 않은 계정입니다. 수신함을 확인해 주세요.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: '로그인에 성공했습니다.' }
}

export async function signUpAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해 주세요.' }
  }

  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자리 이상이어야 합니다.' }
  }

  if (passwordConfirm !== undefined && password !== passwordConfirm) {
    return { error: '비밀번호가 일치하지 않습니다.' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  })

  if (error) {
    if (error.message.includes('User already registered')) {
      return { error: '이미 가입된 이메일 계정입니다.' }
    }
    return { error: error.message }
  }

  // Supabase에서 이미 등록된 유저인지 체크하는 경우 (identities가 빈 배열인 경우)
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: '이미 가입된 이메일 계정입니다.' }
  }

  // 이메일 인증이 활성화되어 세션이 즉시 생성되지 않은 경우
  if (data.user && !data.session) {
    return {
      success: true,
      message: '회원가입 확인 메일이 발송되었습니다! 이메일 링크를 클릭하여 인증을 완료해 주세요.',
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: true,
    message: '회원가입이 완료되었습니다!',
  }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}

