import './styles.css';

function Confirm({ open, handleClose, handleConfirm }) {
    return (
        <>
            {open &&
                <div className='container-confirm'>
                    <div className='arrow-up'>

                    </div>
                    <span>Apagar item?</span>
                    <div className='container-buttons'>
                        <button
                            className='btn-extra-small btn-blue'
                            onClick={handleConfirm}
                        >
                            Sim
                        </button>
                        <button
                            className='btn-extra-small btn-red'
                            onClick={handleClose}
                        >
                            Não
                        </button>
                    </div>
                </div>
            }
        </>
    );
}

export default Confirm;