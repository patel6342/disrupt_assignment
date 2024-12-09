
import React from 'react';
import Layout from './components/ui/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './routes/AuthContext';
import { PrimeReactProvider } from 'primereact/api';


function App() {
    return (
        <AuthProvider>
            <PrimeReactProvider>
                <main className="w-screen h-screen" style={{ backgroundColor: '#f9f9f9', overflowX: 'hidden' }}>
                    <Layout>
                        <ToastContainer />
                        <AppRoutes />
                    </Layout>
                </main>
            </PrimeReactProvider>
        </AuthProvider>
    );
}

export default App;
