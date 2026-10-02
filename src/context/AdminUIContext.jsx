import { createContext, useContext } from 'react'

// Permite que el botón "☰" de cada encabezado (AdminHeader) abra el menú
// lateral que vive en AdminLayout.
export const AdminUIContext = createContext({ alternarMenu: () => {} })

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminUI = () => useContext(AdminUIContext)
