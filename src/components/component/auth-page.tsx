/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Dashboard } from "./dashboard"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface User {
  username: string;
  passwordHash: string;
}

interface AuthenticatedUser {
  user: User;
  authenticated: boolean;
}

const hashPassword = (password: string): string => {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
};

export function AuthPage() {
  if (!global?.window) return null;


  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUsers = window.localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    if (users.length != 0) {
      window.localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const signIn = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username);
    if (user && user.passwordHash === hashPassword(password)) {
      setAuthenticatedUser({ user, authenticated: true });
      return true;
    }
    return false;
  };

  const signOut = () => {
    setAuthenticatedUser(null);
    setEmail('')
    setPass('')
  };

  const addUser = async (user: User) => {
    setUsers([...users, user]);
    setAuthenticatedUser({ user, authenticated: true })
  };

  const handleSignUp = () => {
    const newUser = { username: email, passwordHash: hashPassword(pass) };
    addUser(newUser);
  };

  const handleSignIn = () => {
    const success = signIn(email, pass);
    if (!success) {
      console.log("runs")
      toast({
        title: "Invalid Credentials",
        description: "Enter correct details to make authentication.",
        variant: "destructive"
      })
    }
  };

  const handleSignOut = () => {
    signOut();
  };


  return (
    <div>
      {authenticatedUser ? (
        <div className="w-full h-full overflow-hidden p-2">
          <Dashboard users={users} authenticatedUser={authenticatedUser} />
          <Button className="mt-2" variant={"destructive"} onClick={handleSignOut}>Sign Out</Button>
        </div>
      ) : (
        <div className='h-screen w-screen flex items-center flex-col justify-center p-4'>
          <div className="w-full sm:3/5 xl:w-2/5">
            <div className='dark:bg-neutral-900 p-6 grid items-start select-none gap-4 rounded-2xl'>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Hash Auth System</h1>
                <div className="mb-2 text-sm">
                  Collaborate on <Link href={"https://github.com/Abubakersiddique761/hash-auth-system"} target="_blank" className="text-green-500 hover:underline">GitHub</Link>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  <Badge variant={users.find(u => u.username === email)?.username ? 'default' : 'secondary'} className="text-xs">{users.find(u => u.username === email)?.username ? 'User Identified' : 'New User'}</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email or Username</Label>
                  <Input id="email" placeholder="m@example.com" required value={email} onChange={(e) => { setEmail(e.target.value) }} autoComplete="off" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" required type="password" value={pass} onChange={(e) => { setPass(e.target.value) }} autoComplete="off" />
                  {
                    pass.length != 0 && (
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        <Badge className="text-xs break-all" variant={"secondary"}>{hashPassword(pass)}</Badge>
                      </div>
                    )
                  }
                </div>
                {
                  users.find(u => u.username === email)?.username ?
                    <Button className="w-full" onClick={handleSignIn}>Login</Button>
                    :
                    <Button className="w-full" variant={"secondary"} onClick={handleSignUp}>Register</Button>
                }
              </div>
            </div>
          </div>
          <div className="mt-2 text-sm px-2 text-center">
            Made by <Link href={"https://abubakersiddique761.vercel.app/"} target="_blank" className="text-yellow-500 hover:underline">Abubaker Siddique</Link> & Usaid
          </div>
          <div className="mt-3 text-sm px-2 text-center">
            Using
          </div>
          <div className="text-sm px-2 text-center">
            <Link href={"https://nextjs.org/"} target="_blank" className="text-rose-500 hover:underline">NextJS</Link> - Backend, <Link href={"https://ui.shadcn.com/"} target="_blank" className="text-rose-500 hover:underline">ShadCN</Link> - FrontEnd, & <Link href={"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"} target="_blank" className="text-rose-500 hover:underline">Local Storage</Link> - For Database
          </div>
        </div>
      )}
    </div>
  )
}