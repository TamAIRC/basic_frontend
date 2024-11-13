'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import UserService from '../../../modules/demo/service/UserService';
import { Demo } from '@/types';
import { MultiSelect } from 'primereact/multiselect';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Badge } from 'primereact/badge';

const roleOptions = [
    { label: 'Admin', value: { _id: '6719edbe5b74d6fbd0b6811b', name: 'ADMIN' } },
    { label: 'LAB_TECHNICIAN', value: { _id: '67208b056a300af252b38b1b', name: 'LAB_TECHNICIAN' } },
    { label: 'QUALITY_MANAGER', value: { _id: '67208b006a300af252b38b16', name: 'QUALITY_MANAGER' } },
    { label: 'HOSPITAL_TECHNICIAN', value: { _id: '67208af66a300af252b38b11', name: 'HOSPITAL_TECHNICIAN' } }
];

const Crud = () => {
    let emptyUser: Demo.User = {
        _id: '',
        username: '',
        password: '',
        name: '',
        roles: [],
        createdBy: null,
        updatedBy: null,
        createdAt: '',
        updatedAt: '',
        status: true,
    };

    const [users, setUsers] = useState<Demo.User[] | null>(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<Demo.User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<Demo.User[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const userService = new UserService();
    const breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    const breadcrumbItems = [{ label: 'Quản lý người dùng' },];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await userService.getUsers();
                setUsers(users);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch users' });
            }
        };

        fetchUsers();
    }, []);

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const updateUser = async () => {
        setSubmitted(true);
    
        if (user.username.trim()) {
            try {
                const updatedUser = await userService.updateUser(user._id, {
                    name: user.name,
                    password: user.password,
                    roles: user.roles.map(role => role._id)
                });
                const updatedUsers = users?.map(u => (u._id === updatedUser._id ? updatedUser : u));
                setUsers(updatedUsers || null);
                setUserDialog(false);
                setUser(emptyUser);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
            }
        }
    };

    const saveUser = async () => {
        setSubmitted(true);

        if (user.username.trim()) {
            let _users = [...(users || [])];
            let _user = { ...user };

            if (user._id) {
                try {
                    const updatedUser = await userService.updateUser(_user._id.toString(), {
                        name: _user.name,
                        password: _user.password,
                        roles: _user.roles.map(role => role._id)
                    });
                    const index = findIndexById(user._id);
                    _users[index] = updatedUser;
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update user' });
                }
            } else {
                try {
                    const createdUser = await userService.createUser(_user);
                    _users.push(createdUser);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                } catch (error) {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to create user' });
                }
            }

            setUsers(_users);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (user: Demo.User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: Demo.User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const changeUserStatus = async () => {
        try {
            await userService.changeUserStatus(user._id.toString(), false);
            let _users = users?.map(val => val._id === user._id ? { ...val, status: false } : val);
            setUsers(_users || null);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
        }
    };

    const findIndexById = (id: string) => {
        let index = -1;
        if (!users) return -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i]._id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = async () => {
        if (selectedUsers && selectedUsers.length > 0) {
            try {
                const updatedUsers = await Promise.all(
                    selectedUsers.map(async (user) => {
                        await userService.changeUserStatus(user._id.toString(), false);
                        return { ...user, status: false };
                    })
                );
                setUsers((prevUsers) =>
                    prevUsers?.map((user) =>
                        updatedUsers.find((updatedUser) => updatedUser._id === user._id) || user
                    ) || null
                );
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Users Status Changed', life: 3000 });
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to change user status' });
            }
        }
    };

    const deleteSelectedUsers = async () => {
        let _users = users?.filter(val => !selectedUsers?.includes(val));
        setUsers(_users || null);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        (_user as any)[name] = val;

        setUser(_user);
    };

    const onMultiSelectChange = (e: { value: Demo.Role[] }, name: string) => {
        const val = e.value;
        let _user = { ...user };
        (_user as any)[name] = val;

        setUser(_user);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
        </React.Fragment>
    );

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={changeUserStatus} />
        </React.Fragment>
    );

    const deleteUsersDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUsers} />
        </React.Fragment>
    );

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Manage Users</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
            </span>
        </div>
    );

    const statusBodyTemplate = (rowData: Demo.User) => {
        return (
            <span className={`product-badge status-${rowData.status === true ? 'instock' : 'outofstock'}`}>
                {rowData.status === true ? 'Active' : 'Deactivated'}
            </span>
        );
    };

    const rolesBodyTemplate = (rowData: Demo.User) => {
        return (
            <div>
                {Array.isArray(rowData.roles) ? (
                    rowData.roles.map((role) => (
                        <Badge key={role._id} value={role.name} severity="info" className="mr-2" />
                    ))
                ) : (
                    <span>No roles assigned</span>
                )}
            </div>
        );
    };

    const UpdateByBodyTemplate = (rowData: Demo.User) => {
        return (
            <div>
                {Array.isArray(rowData.updatedBy) ? (
                    rowData.updatedBy.map((updatedBy, index) => (
                        <span key={updatedBy._id || index} className="mr-2">{updatedBy.username}</span>
                    ))
                ) : rowData.updatedBy ? (
                    <span className="mr-2">{(rowData.updatedBy as Demo.User).username}</span>
                ) : (
                    'N/A'
                )}
            </div>
        );
    };
    
    const CreateByBodyTemplate = (rowData: Demo.User) => {
        return (
            <div>
                {Array.isArray(rowData.createdBy) ? (
                    rowData.createdBy.map((createdBy, index) => (
                        <span key={createdBy._id || index} className="mr-2">{createdBy.username}</span>
                    ))
                ) : rowData.createdBy ? (
                    <span className="mr-2">{(rowData.createdBy as Demo.User).username}</span>
                ) : (
                    'N/A'
                )}
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Demo.User) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <div className="layout-main">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users || []}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value as Demo.User[])}
                        dataKey="_id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                        <Column field="_id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="username" header="Username" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="createdBy" header="Created By" body={CreateByBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="createdAt" header="Created At" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="updatedBy" header="Updated By" body={UpdateByBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="updatedAt" header="Updated At" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="roles" header="Roles" body={rolesBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>

                <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                    <div className="field">
                        <label htmlFor="name">Tên người dùng</label>
                        <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                        {submitted && !user.name && <small className="p-error">Tên người dùng là bắt buộc.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <InputText id="username" value={user.username} onChange={(e) => onInputChange(e, 'username')} required className={classNames({ 'p-invalid': submitted && !user.username })} />
                        {submitted && !user.username && <small className="p-error">Tên đăng nhập là bắt buộc.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="password">Mật khẩu</label>
                        <InputText id="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required className={classNames({ 'p-invalid': submitted && !user.password })} />
                        {submitted && !user.password && <small className="p-error">Mật khẩu là bắt buộc</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="role">Role</label>
                        <MultiSelect
                            id="roles"
                            value={user.roles}
                            options={roleOptions}
                            onChange={(e) => onMultiSelectChange(e, 'roles')}
                            placeholder="Select Roles"
                            display="chip"
                        />
                    </div>
                </Dialog>

                <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {user && <span>Are you sure you want to change <b>{user.username}</b>'s status?</span>}
                    </div>
                </Dialog>

                <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {selectedUsers && <span>Are you sure you want to delete the selected users?</span>}
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default Crud;