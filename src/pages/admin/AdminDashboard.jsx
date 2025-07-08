// import { useAllUsers, useAllLessons, useAllExams, useDashboardStats, useRecentPurchases, useRecentExams } from "../../hooks/useAdmin";

// export default function AdminDashboard() {
//   // Data fetching
//   const { data: users, isLoading: usersLoading } = useAllUsers();
//   const { data: lessons, isLoading: lessonsLoading } = useAllLessons();
//   const { data: exams, isLoading: examsLoading } = useAllExams();
//   const { data: stats, isLoading: statsLoading } = useDashboardStats();
//   const { data: recentPurchases } = useRecentPurchases();
//   const { data: recentExams } = useRecentExams();

//   // Dashboard statistics
//   const dashboardStats = [
//     {
//       name: "Total Users",
//       value: users?.data?.length || 0,
//       icon: "👥",
//       gradient: "from-blue-500 to-purple-600",
//       change: "+8%",
//       changeType: "positive",
//     },
//     {
//       name: "Total Lessons",
//       value: lessons?.data?.length || 0,
//       icon: "📚",
//       gradient: "from-green-500 to-teal-600",
//       change: "+12%",
//       changeType: "positive",
//     },
//     {
//       name: "Total Exams",
//       value: exams?.data?.length || 0,
//       icon: "📝",
//       gradient: "from-orange-500 to-red-600",
//       change: "+5%",
//       changeType: "positive",
//     },
//     {
//       name: "Revenue",
//       value: `$${stats?.totalRevenue || 0}`,
//       icon: "💰",
//       gradient: "from-yellow-500 to-orange-600",
//       change: "+15%",
//       changeType: "positive",
//     },
//   ];

//   if (usersLoading || lessonsLoading || examsLoading || statsLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="relative">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Welcome Header */}
//       <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-2xl p-8 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👨‍💻</h1>
//             <p className="text-purple-100 text-lg">Manage your educational platform with ease</p>
//           </div>
//           <div className="hidden md:block">
//             <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
//               <span className="text-4xl">👨‍💻</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {dashboardStats.map((stat, index) => (
//           <div
//             key={stat.name}
//             className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div
//                   className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}
//                 >
//                   <span className="text-2xl">{stat.icon}</span>
//                 </div>
//                 <div
//                   className={`text-sm font-medium px-2 py-1 rounded-full ${
//                     stat.changeType === "positive" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
//                   }`}
//                 >
//                   {stat.change}
//                 </div>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
//                 <p className="text-sm text-gray-600">{stat.name}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Recent Purchases */}
//         <div className="bg-white rounded-2xl shadow-lg">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold text-gray-900">Recent Purchases</h3>
//               <span className="text-sm text-purple-600 font-medium">View All</span>
//             </div>
//           </div>
//           <div className="p-6">
//             {recentPurchases?.data?.slice(0, 4).map((purchase) => (
//               <div
//                 key={purchase._id}
//                 className="flex items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
//                   <span className="text-white text-lg">💰</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900 mb-1">{purchase.studentName}</p>
//                   <p className="text-sm text-gray-500">Purchased: {purchase.lessonTitle}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-medium text-green-600">${purchase.amount}</p>
//                   <p className="text-xs text-gray-500">{purchase.date}</p>
//                 </div>
//               </div>
//             )) || (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">💰</span>
//                 </div>
//                 <p className="text-gray-500">No recent purchases</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Exam Submissions */}
//         <div className="bg-white rounded-2xl shadow-lg">
//           <div className="p-6 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold text-gray-900">Recent Exam Submissions</h3>
//               <span className="text-sm text-green-600 font-medium">View All</span>
//             </div>
//           </div>
//           <div className="p-6">
//             {recentExams?.data?.slice(0, 4).map((exam) => (
//               <div
//                 key={exam._id}
//                 className="flex items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
//               >
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
//                   <span className="text-white text-lg">📝</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900 mb-1">{exam.studentName}</p>
//                   <p className="text-sm text-gray-500">Exam: {exam.examTitle}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className={`font-medium ${exam.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
//                     {exam.score}%
//                   </p>
//                   <p className="text-xs text-gray-500">{exam.submittedAt}</p>
//                 </div>
//               </div>
//             )) || (
//               <div className="text-center py-8">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <span className="text-2xl">📝</span>
//                 </div>
//                 <p className="text-gray-500">No recent exam submissions</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-2xl shadow-lg">
//         <div className="p-6 border-b border-gray-100">
//           <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
//               <span className="text-2xl mr-3">📚</span>
//               <div className="text-left">
//                 <p className="font-medium">Add New Lesson</p>
//                 <p className="text-sm opacity-90">Create educational content</p>
//               </div>
//             </button>
            
//             <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
//               <span className="text-2xl mr-3">📝</span>
//               <div className="text-left">
//                 <p className="font-medium">Create Exam</p>
//                 <p className="text-sm opacity-90">Set up assessments</p>
//               </div>
//             </button>
            
//             <button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
//               <span className="text-2xl mr-3">👥</span>
//               <div className="text-left">
//                 <p className="font-medium">Manage Users</p>
//                 <p className="text-sm opacity-90">View and edit users</p>
//               </div>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* System Status */}
//       <div className="bg-white rounded-2xl shadow-lg">
//         <div className="p-6 border-b border-gray-100">
//           <h3 className="text-xl font-bold text-gray-900">System Status</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
//                 <span className="font-medium text-gray-900">API Status</span>
//               </div>
//               <span className="text-green-600 font-medium">Online</span>
//             </div>
            
//             <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
//                 <span className="font-medium text-gray-900">Database</span>
//               </div>
//               <span className="text-blue-600 font-medium">Connected</span>
//             </div>
            
//             <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
//                 <span className="font-medium text-gray-900">Storage</span>
//               </div>
//               <span className="text-yellow-600 font-medium">75% Used</span>
//             </div>
            
//             <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
//                 <span className="font-medium text-gray-900">Last Backup</span>
//               </div>
//               <span className="text-purple-600 font-medium">2 hours ago</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client"

import { useAllUsers, useAllLessons, useAllExams, useDashboardStats, usePendingPayments } from "../../hooks/useAdmin"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
  const navigate = useNavigate()

  // Data fetching
  const { data: users, isLoading: usersLoading } = useAllUsers()
  const { data: lessons, isLoading: lessonsLoading } = useAllLessons()
  const { data: exams, isLoading: examsLoading } = useAllExams()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: pendingPayments } = usePendingPayments()

  // Dashboard statistics
  const dashboardStats = [
    {
      name: "Total Users",
      value: users?.data?.length || 0,
      icon: "👥",
      gradient: "from-blue-500 to-purple-600",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Total Lessons",
      value: lessons?.data?.length || 0,
      icon: "📚",
      gradient: "from-green-500 to-teal-600",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Exams",
      value: exams?.data?.length || 0,
      icon: "📝",
      gradient: "from-orange-500 to-red-600",
      change: "+5%",
      changeType: "positive",
    },
    {
      name: "Pending Payments",
      value: pendingPayments?.data?.length || 0,
      icon: "💰",
      gradient: "from-yellow-500 to-orange-600",
      change: pendingPayments?.data?.length > 0 ? "New!" : "0",
      changeType: pendingPayments?.data?.length > 0 ? "warning" : "positive",
    },
  ]

  if (usersLoading || lessonsLoading || examsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👨‍💻</h1>
            <p className="text-purple-100 text-lg">Manage your educational platform with ease</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}
                >
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === "positive"
                      ? "text-green-600 bg-green-100"
                      : stat.changeType === "warning"
                        ? "text-orange-600 bg-orange-100"
                        : "text-red-600 bg-red-100"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin/lessons/create")}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-2xl mr-3">📚</span>
              <div className="text-left">
                <p className="font-medium">Add Lesson</p>
                <p className="text-sm opacity-90">Create content</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/exams/create")}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-2xl mr-3">📝</span>
              <div className="text-left">
                <p className="font-medium">Create Exam</p>
                <p className="text-sm opacity-90">Set assessments</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/questions/create")}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-2xl mr-3">❓</span>
              <div className="text-left">
                <p className="font-medium">Add Question</p>
                <p className="text-sm opacity-90">Build question bank</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/payments")}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-2xl mr-3">💰</span>
              <div className="text-left">
                <p className="font-medium">Payments</p>
                <p className="text-sm opacity-90">Manage transactions</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-sm text-purple-600 font-medium hover:text-purple-800"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {users?.data?.slice(0, 4).map((user) => (
              <div
                key={user._id}
                className="flex items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">👤</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{user.fullName || user.email}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Pending Payments</h3>
              <button
                onClick={() => navigate("/admin/payments")}
                className="text-sm text-green-600 font-medium hover:text-green-800"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {pendingPayments?.data?.slice(0, 4).map((payment) => (
              <div
                key={payment._id}
                className="flex items-center py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-white text-lg">💰</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{payment.studentName}</p>
                  <p className="text-sm text-gray-500">{payment.lessonTitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">${payment.amount}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-gray-500">No pending payments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">API Status</span>
              </div>
              <span className="text-green-600 font-medium">Online</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <span className="text-blue-600 font-medium">Connected</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Storage</span>
              </div>
              <span className="text-yellow-600 font-medium">75% Used</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Last Backup</span>
              </div>
              <span className="text-purple-600 font-medium">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
