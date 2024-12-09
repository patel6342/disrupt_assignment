import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmationPopup from '../../Modal/ConfirmationModal/ConfirmationModal';


const Footer = ({ onSubmit, Role, onLoading, isDirty }) => {
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (isDirty) {
            console.log(onSubmit, "on submit in back click")
            setShowConfirmationModal(true);
        }
        else {

            navigate(-1);
        }

    };

    const handleConfirmGoBack = () => {
        console.log(onSubmit, "onsubmit in confrim back")
        setShowConfirmationModal(false);

        navigate(-1);
    };

    const handleCancel = () => {
        setShowConfirmationModal(false);
    };

    return (
        <>
            {showConfirmationModal && (
                <ConfirmationPopup
                    confirmTitle="Confirm Navigation"
                    confirmDesc="Are you sure you want to go back? Any data entered will be lost."
                    item={{ "S No.": "1" }}
                    onClose={handleCancel}
                    onConfirm={handleConfirmGoBack}
                    onSubmit={onSubmit}
                    participantFinalSubmit={false}
                />
            )}
            <div className="w-full mx-auto" style={{ marginLeft: '1px' }}>
                <div className="flex justify-end block max-w-full py-2 px-3 linearbg border border-gray-200 rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[18px] rounded-br-[18px] shadow">
                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-[#ffffff] text-[#A4A3A9] py-1 px-8 rounded border-2 border-[#E8E8EA] w-[130px] cursor-pointer"
                            onClick={handleBackClick}
                        >
                            Back
                        </button>
                        <button
                            className="bg-[#4C6EF5] text-white py-1 px-8 rounded border-2 border-[#4C6EF5] w-[130px] cursor-pointer"
                            onClick={() => { if (Role === "judge") { onSubmit() } onSubmit(false) }}
                            disabled={Role === 'judge' && onLoading}
                        >
                            {Role === 'admin' ? 'Update' : (Role === 'game_master' ? 'Save' : 'Submit')}

                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
