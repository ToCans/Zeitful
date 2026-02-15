interface ConfirmationModalProps {
    setShowConfirm: (show: boolean) => void;
    confirmNavigation: () => void;
}

const ConfirmationModal = ({
    setShowConfirm,
    confirmNavigation,
}: ConfirmationModalProps) => {
    // No need to pass these as props anymore
    // const setTimerRunning = useTimerStore((state) => state.setTimerRunning);
    // const timerWorker = useRefsStore((state) => state.timerWorker);

    return (
        <div className='...'>
            {/* Modal content */}
            <button onClick={confirmNavigation}>
                Confirm
            </button>
            <button onClick={() => setShowConfirm(false)}>
                Cancel
            </button>
        </div>
    );
};

export default ConfirmationModal;