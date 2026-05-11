import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, saveUser } from '../../api/userApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import '../../css/UserCss/UserForm.css';

const UserForm = () => {
    const { id } = useParams(); // Get ID from URL if editing
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        idUser: 0,
        userFullName: '',
        userName: '',
        password: '',
        email: '',
        idDepartment: 0,
        idDesignation: 0,
        isActive: true,
        e_By: 'Admin'
    });

    useEffect(() => {
        if (id) {
            loadUser(id);
        }
    }, [id]);

    const loadUser = async (userId) => {
        const res = await getUserById(userId);
        if (res.success) {
            setFormData(res.data);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await saveUser(formData);
            if (res.success) {
                alert(res.message);
                navigate('/users');
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Error saving user", error);
        }
    };

    return (
        <DashboardLayout>
            <div className="user-form-container">
                <h2 className="form-title">{id ? 'Edit User' : 'Add New User'}</h2>

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="userFullName" value={formData.userFullName || ''} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="userName" value={formData.userName || ''} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password || ''} onChange={handleChange} required={!id} />
                    </div>

                    {/* Later you can fetch actual Departments and Designations here */}
                    <div className="form-group">
                        <label>Department ID</label>
                        <input type="number" name="idDepartment" value={formData.idDepartment || 0} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Designation ID</label>
                        <input type="number" name="idDesignation" value={formData.idDesignation || 0} onChange={handleChange} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn">Save User</button>
                        <button type="button" className="cancel-btn" onClick={() => navigate('/users')}>Cancel</button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default UserForm;
