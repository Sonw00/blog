import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '@/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자리 이상이어야 합니다.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInAnonymously(auth);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(`익명 로그인 중 오류가 발생했습니다.(${error})`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      setErrorMsg(`이메일 또는 비밀번호가 올바르지 않습니다.(${error})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-slate-800">로그인</CardTitle>
          <CardDescription className="text-center">계정에 로그인하여 서비스를 이용해보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="이메일"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="비밀번호"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAnonymousLogin}
              disabled={isLoading}
            >
              익명으로 시작하기
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
