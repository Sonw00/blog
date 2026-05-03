import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

const signupSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자리 이상이어야 합니다.'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg('이미 사용 중인 이메일입니다.');
      } else {
        setErrorMsg(`회원가입 중 오류가 발생했습니다.(${error})`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-slate-800">회원가입</CardTitle>
          <CardDescription className="text-center">새로운 계정을 생성하여 서비스를 시작해보세요.</CardDescription>
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
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="비밀번호 확인"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
