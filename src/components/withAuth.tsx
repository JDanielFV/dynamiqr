import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[]) => {
  const AuthComponent = (props: any) => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (!allowedRoles.includes(parsedUser.role)) {
          router.replace('/dashboard'); // Or a dedicated 'unauthorized' page
        }
      } else {
        router.replace('/login');
      }
    }, [router]);

    if (!user) {
      return <div>Loading...</div>; // Or a proper loader
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
