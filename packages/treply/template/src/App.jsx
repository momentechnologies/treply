import { hot } from 'react-hot-loader/root';
import React from 'react';
import styles from './app.module.scss';

function App() {
    return (
        <div className={styles.app}>
            <header className="App-header">The treply app</header>
        </div>
    );
}

export default hot(App);
