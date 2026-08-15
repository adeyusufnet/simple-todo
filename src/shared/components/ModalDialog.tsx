import InputComponent from "./SimpleInput";

interface ModalDialogProps {
    formData: any;
    handleChange: () => void;
    handleSubmit: () => void;
    handleCancel: () => void;
    handleClose: () => void;
}

export default function ModalDialogComponent({ formData, handleChange, handleSubmit, handleCancel, handleClose }: ModalDialogProps) {
    return (
        <div className="modal-container">
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "20px"
            }}>
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <button
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            color: "black",
                            fontSize: "16px",
                            cursor: "ponter"
                        }}
                        onClick={handleClose}
                    >
                        x
                    </button>
                </div>
                <InputComponent
                    inputId='todo'
                    inputName="name"
                    labelName='ToDo'
                    inputType='text'
                    inputValue={formData?.name}
                    onChange={handleChange}
                />
                <InputComponent
                    inputId='date'
                    inputName="date"
                    labelName='Tanggal'
                    inputType='date'
                    inputValue={formData?.date}
                    onChange={handleChange}
                />
            </div>
            <div style={{
                display: "flex",
                gap: "5px",
                width: "50%",
                height: "100%",
                marginTop: "auto"
            }}>
                <button
                    onClick={handleSubmit}
                    className="big-button"
                    style={{
                        backgroundColor: formData?.name !== "" ? "rgb(120, 120, 120)" : "rgb(120, 120, 120, 0.6)",
                        width: "100%"
                    }}
                    disabled={formData?.name === ""}
                >
                    {formData?.id ? "Ubah" : "Tambah"}
                </button>
                {formData.id !== null && (
                    <button
                        onClick={handleCancel}
                        className="big-button" style={{
                            backgroundColor: formData?.name !== "" ? "rgb(120, 120, 120)" : "rgb(120, 120, 120, 0.6)"
                        }}>
                        Batal
                    </button>
                )}
            </div>
        </div>
    )
}