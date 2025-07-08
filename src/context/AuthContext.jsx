"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: "",
    user: null,
    role: null,
  })

  const [loading, setLoading] = useState(true) // ✅ Start as true

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    const restoreSession = async () => {
      try {
        const decoded = jwtDecode(token)

        const now = Date.now() / 1000
        if (decoded.exp < now) {
          throw new Error("Token expired")
        }

        const email = decoded?.email
        let role = "student"

        if (email === "s_admin@gmail.com") {
          role = "super-admin"
        } else {
          try {
            const adminRes = await axios.get("https://edu-master-delta.vercel.app/admin/all-user", {
              headers: { token },
            })
            if (adminRes.data.success) {
              role = "admin"
            }
          } catch {
            role = "student"
          }
        }

        setAuth({ token, user: email, role })
        console.log("✅ Session restored:", { email, role }) // Debug log
      } catch (err) {
        console.error("❌ Failed to restore session", err)
        localStorage.removeItem("token")
        setAuth({ token: "", user: null, role: null })
      } finally {
        setLoading(false) // ✅ End loading
      }
    }

    restoreSession()
  }, [])

  const login = async (data) => {
    setLoading(true)
    try {
      const decoded = jwtDecode(data.token)
      const email = decoded?.email

      localStorage.setItem("token", data.token)

      let role = "student"

      if (email === "s_admin@gmail.com") {
        role = "super-admin"
      } else {
        try {
          const adminRes = await axios.get("https://edu-master-delta.vercel.app/admin/all-user", {
            headers: { token: data.token },
          })
          if (adminRes.data.success) {
            role = "admin"
          }
        } catch {
          role = "student"
        }
      }

      setAuth({ token: data.token, user: email, role })
      console.log("✅ Login successful:", { email, role }) // Debug log
    } catch (err) {
      console.error("❌ Login failed:", err)
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setAuth({ token: "", user: null, role: null })
    console.log("✅ Logged out") // Debug log
  }

  return <AuthContext.Provider value={{ auth, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
