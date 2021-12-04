import React from 'react'
import './App.css'
import data from './api/data.json'

const Schedule = React.lazy(() => import('./components/Schedule'))

function App() {
    return (
        <React.Suspense fallback="">
            <div className="App">
                <Schedule data={data} />
            </div>
        </React.Suspense>
    )
}

export default App
