'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { BreadCrumb } from 'primereact/breadcrumb';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import RoleService from '../../../modules/demo/service/RoleService';
import PermissionService from '../../../modules/demo/service/PermissionService';
import '../../../modules/demo/styles/RolePermissionTable.scss';
import { Demo } from '@/types';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const RolePermissionTable = () => {
    const [roles, setRoles] = useState<Demo.Role[]>([]);
    const [permissions, setPermissions] = useState<Demo.Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Demo.Permissions>({});
    const toast = React.useRef<Toast>(null);
    const [isSaved, setIsSaved] = useState(false);
    const breadcrumbHome = { icon: 'pi pi-home', to: '/' };
    const breadcrumbItems = [{ label: 'Quản lý vai trò' },];
    const roleService = new RoleService();
    const permissionService = new PermissionService();
    const [newPermissionName, setNewPermissionName] = useState('');
    const [newRoleName, setNewRoleName] = useState('');
    const [permissionDialog, setPermissionDialog] = useState(false);
    const [roleDialog, setRoleDialog] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.getRoles(1, 30);
                const rolesData = response.data
                    .filter((role: any) => role.status !== false)
                    .map((role: any) => {
                    const rolePermissions = role.grantAll ? permissions.map(p => p.name) : role.permissions;
                    return { ...role, permissions: rolePermissions };
                });
                setRoles(rolesData);
            } catch (error) {
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch roles' });
                }
            }
        };

        const fetchPermissions = async () => {
            try {
                const response = await permissionService.getPermissions(1, 30);
                setPermissions(response.permissions);
            } catch (error) {
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch permissions' });
                }
            }
        };

        fetchRoles();
        fetchPermissions();
    }, []);

    useEffect(() => {
        const initializeSelectedPermissions = () => {
            const initialSelectedPermissions: Demo.Permissions = {};
            roles.forEach(role => {
                permissions.forEach(permission => {
                    const key = `${role.name}-${permission.name}`;
                    initialSelectedPermissions[key] = role.grantAll || role.permissions.includes(permission.name);
                });
            });
            setSelectedPermissions(initialSelectedPermissions);
        };

        initializeSelectedPermissions();
    }, [roles, permissions]);

    const onPermissionChange = (roleName: string, permissionName: string) => {
        const key = `${roleName}-${permissionName}`;
        setSelectedPermissions(prevSelectedPermissions => ({
            ...prevSelectedPermissions,
            [key]: !prevSelectedPermissions[key],
        }));
    };

    const hideDialog = () => {
        setPermissionDialog(false);
        setRoleDialog(false);
    };

    const savePermission = async () => {
        try {
            const response = await permissionService.createPermission(newPermissionName);
            setPermissions([...permissions, response.data]);
            setPermissionDialog(false);
            showToast('success', 'Successful', 'Permission Created');
        } catch (error) {
            showToast('error', 'Error', 'Failed to create permission');
        }
    };
    
    const saveRole = async () => {
        try {
            const response = await roleService.createRole(newRoleName);
            setRoles([...roles, response.data]);
            setRoleDialog(false);
            showToast('success', 'Successful', 'Role Created');
        } catch (error) {
            showToast('error', 'Error', 'Failed to create role');
        }
    };

    const openNewPermissionDialog = () => {
        setNewPermissionName('');
        setPermissionDialog(true);
    };
    
    const openNewRoleDialog = () => {
        setNewRoleName('');
        setRoleDialog(true);
    };

    const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail });
        }
    };

    const onEditRole = (roleName: string) => {
        showToast('info', 'Edit Role', `Editing role ${roleName}`);
    };

    const onDeleteRole = (roleId: string) => {
        confirmDialog({
            message: `Are you sure you want to deactivate the role?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    const response = await roleService.changeRoleStatus(roleId, false);
                    setRoles(roles.filter(role => role._id !== roleId));
                    showToast('warn', 'Role Deactivated', `Role ${response.data.name} deactivated successfully`);
                } catch (error) {
                    showToast('error', 'Error', 'Failed to deactivate role');
                }
            },
        });
    };

    const onEditPermission = (permissionName: string) => {
        showToast('info', 'Edit Permission', `Editing permission ${permissionName}`);
    };

    const onDeletePermission = (permissionName: string) => {
        confirmDialog({
            message: `Are you sure you want to delete the permission ${permissionName}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => showToast('warn', 'Delete Permission', `Permission ${permissionName} deleted`),
        });
    };

    const handleSaveClick = () => {
        confirmDialog({
            message: 'Do you want to save the changes?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => setIsSaved(true),
        });
    };

    return (
        <div className="layout-main">
            <div className="col-12">
                <BreadCrumb home={breadcrumbHome} model={breadcrumbItems} />
                <div className="role-permission-table">
                    <Toast ref={toast} />
                    <div className="button-container">
                        <Button label="Thêm quyền" icon="pi pi-plus" className="p-button-primary" onClick={openNewPermissionDialog} />
                        <Button label="Thêm vai trò" icon="pi pi-plus" className="p-button-primary" onClick={openNewRoleDialog}/>
                    </div>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th></th>
                                {roles.map((role, index) => (
                                    <th key={index}>
                                        {role.name}
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-secondary" onClick={() => onEditRole(role.name)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-secondary" onClick={() => onDeleteRole(role._id)} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((permission, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>{permission.name}</td>
                                    {roles.map((role, colIndex) => {
                                        const key = `${role.name}-${permission.name}`;
                                        return (
                                            <td key={colIndex}>
                                                <Checkbox checked={!!selectedPermissions[key]} onChange={() => onPermissionChange(role.name, permission.name)} />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="save-button-container">
                        <Button
                            label="Lưu"
                            className={`${isSaved ? 'p-button-success' : 'p-button-primary'} p-mt-3`}
                            onClick={handleSaveClick}
                        />
                    </div>
                    <ConfirmDialog />
                    <Dialog visible={permissionDialog} style={{ width: '450px' }} header="Thêm quyền" modal className="p-fluid" footer={<>
                        <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                        <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={savePermission} />
                    </>} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="permissionName">Tên quyền</label>
                            <InputText id="permissionName" value={newPermissionName} onChange={(e) => setNewPermissionName(e.target.value)} required autoFocus />
                        </div>
                    </Dialog>
                    <Dialog visible={roleDialog} style={{ width: '450px' }} header="Thêm vai trò" modal className="p-fluid" footer={<>
                        <Button label="Hủy" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                        <Button label="Lưu" icon="pi pi-check" className="p-button-text" onClick={saveRole} />
                    </>} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="roleName">Tên vai trò</label>
                            <InputText id="roleName" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} required autoFocus />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default RolePermissionTable;