import { Outlet } from 'react-router';
import { Header } from './components/Header/Header';
import './App.css';

export default function App() {
    return (
        <main className="app">
            <div className="app__container">
                <Header />
                <Outlet />
            </div>
        </main>
    );
}
