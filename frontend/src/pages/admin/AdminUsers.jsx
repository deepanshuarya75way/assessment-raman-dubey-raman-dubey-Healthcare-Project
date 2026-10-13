import React, { useContext, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

const AdminUsers = () => {
  const { adminToken } = useOutletContext()
  const { backendUrl } = useContext(AppContext)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Fetch users error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-[var(--text-muted)]'>Loading users...</p>
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <h1 className='text-2xl font-bold text-[var(--text-primary)]'>Registered Users</h1>

        <div className='relative max-w-xs'>
          <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input
            className='input-field pl-10 !py-2 text-sm'
            type='text'
            placeholder='Search users...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className='flex gap-4 mb-6'>
        <div className='px-5 py-3 rounded-xl font-semibold text-sm bg-blue-50 text-blue-600'>
          Total: {users.length}
        </div>
      </div>

      {/* Users Table */}
      <div className='glass-card-static p-6 overflow-x-auto'>
        {filteredUsers.length === 0 ? (
          <p className='text-[var(--text-muted)] text-center py-10'>
            {search ? `No users found for "${search}".` : 'No registered users yet.'}
          </p>
        ) : (
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-[var(--border-subtle)]'>
                <th className='text-left py-3 px-3 text-[var(--text-muted)] font-medium'>#</th>
                <th className='text-left py-3 px-3 text-[var(--text-muted)] font-medium'>User</th>
                <th className='text-left py-3 px-3 text-[var(--text-muted)] font-medium'>Email</th>
                <th className='text-left py-3 px-3 text-[var(--text-muted)] font-medium'>Phone</th>
                <th className='text-left py-3 px-3 text-[var(--text-muted)] font-medium'>Gender</th>
                <th className='text-left py-3 px-3 text-[var(--text-muted)] font-medium'>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className='border-b border-[var(--border-subtle)] hover:bg-[var(--primary-lighter)] transition-colors'
                >
                  <td className='py-3 px-3 text-[var(--text-muted)]'>{index + 1}</td>
                  <td className='py-3 px-3'>
                    <div className='flex items-center gap-3'>
                      {user.image ? (
                        <img
                          src={user.image.startsWith('http') ? user.image : `${backendUrl}${user.image}`}
                          alt={user.name}
                          className='w-9 h-9 rounded-full object-cover border-2 border-[var(--primary-lighter)]'
                        />
                      ) : (
                        <div className='w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm'>
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <span className='font-medium text-[var(--text-primary)]'>{user.name}</span>
                    </div>
                  </td>
                  <td className='py-3 px-3 text-[var(--text-secondary)]'>{user.email}</td>
                  <td className='py-3 px-3 text-[var(--text-muted)]'>{user.phone || '—'}</td>
                  <td className='py-3 px-3'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.gender === 'Male' ? 'bg-blue-50 text-blue-600' :
                      user.gender === 'Female' ? 'bg-pink-50 text-pink-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {user.gender || 'N/A'}
                    </span>
                  </td>
                  <td className='py-3 px-3 text-[var(--text-muted)]'>{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
