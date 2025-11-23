// import React, { useState } from 'react';
// import Button from '../components/ui/Button';
// import Input from '../components/ui/Input';
// import * as authApi from '../api/auth';
// import { useNavigate } from 'react-router-dom';

// export default function Signup() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       await authApi.signup({ name, email, password });
//       nav('/login');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Signup failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="w-full max-w-md p-6">
//         <div className="bg-white/60 rounded-2xl p-8 glass fade-in">
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold">Create account</h2>
//             <p className="text-muted text-sm mt-1">Quick sign up to start using the CRM</p>
//           </div>

//           <form onSubmit={submit} className="space-y-4">
//             {error && <div className="text-red-600">{error}</div>}
//             <Input label="Full name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//             <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//             <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//             <div className="flex justify-end">
//               <Button type="submit" variant="solid" size="md" disabled={loading}>
//                 {loading ? 'Creating...' : 'Sign up'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import * as authApi from '../api/auth';
import { useNavigate } from 'react-router-dom';


export default function Signup() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const nav = useNavigate();


const submit = async (e) => {
e.preventDefault();
setError('');
setLoading(true);
try {
await authApi.signup({ name, email, password });
nav('/login');
} catch (err) {
setError(err.response?.data?.message || err.message || 'Signup failed');
} finally {
setLoading(false);
}
};


return (
<div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 to-slate-200">
<div className="w-full max-w-md p-6 sm:p-8 bg-white/60 rounded-2xl backdrop-blur-xl shadow-xl border border-white/30 glass fade-in">
<h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">Create account</h2>
<p className="text-sm text-muted mb-6 text-center">Quick sign up to start using the CRM</p>


<form onSubmit={submit} className="space-y-4">
{error && <div className="text-red-600 text-center">{error}</div>}


<Input label="Full name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
<Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
<Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />


<div className="flex justify-end text-sm pt-2">
<a href="/login" className="text-sky-600 hover:underline">Already have an account?</a>
</div>


<Button type="submit" disabled={loading} className="w-full mt-2">
{loading ? 'Signing...' : 'Create account'}
</Button>
</form>
</div>
</div>
);
}