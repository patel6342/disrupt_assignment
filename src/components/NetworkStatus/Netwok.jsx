import * as React from 'react';

const getOnLineStatus = () =>
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
        ? navigator.onLine
        : true;

const useNavigatorOnLine = ({ onSubmit }) => {
    const [status, setStatus] = React.useState(getOnLineStatus());
    const [wasOffline, setWasOffline] = React.useState(false); // Track if the user was offline

    console.log(status, "Network status");

    // Effect to handle online and offline status changes
    React.useEffect(() => {
        const setOnline = () => {
            setStatus(true);
            if (wasOffline) {
                // If the user was previously offline, call the API only once
                onSubmit(true);
                setWasOffline(false); // Reset the offline flag
            }
        };

        const setOffline = () => {
            setStatus(false);
            setWasOffline(true); // Set the offline flag when the user goes offline
        };

        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, [wasOffline, onSubmit]);

    return status;
};

export default useNavigatorOnLine;
