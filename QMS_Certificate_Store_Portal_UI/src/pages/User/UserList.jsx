import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../api/userApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import '../../css/UserCss/UserList.css'; // Import the specific CSS

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await getAllUsers();
            if (res.success) setUsers(res.data);
        } catch (error) {
            console.error("Error loading users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await deleteUser(id);
                if (res.success) loadUsers();
            } catch (error) {
                alert("Error deleting user");
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="user-list-header">
                <h2>User Management</h2>
                <button className="user-add-btn" onClick={() => navigate('/users/add')}>+ Add New User</button>
            </div>

            <div className="user-table-wrapper">
                {loading ? <p>Loading...</p> : (
                    <table className="user-master-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Full Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.idUser}>
                                    <td>{user.idUser}</td>
                                    <td>{user.userFullName}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.departmentName}</td>
                                    <td>
                                        <button className="user-edit-btn" onClick={() => navigate(`/users/edit/${user.idUser}`)}>Edit</button>
                                        <button className="user-delete-btn" onClick={() => handleDelete(user.idUser)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserList;
