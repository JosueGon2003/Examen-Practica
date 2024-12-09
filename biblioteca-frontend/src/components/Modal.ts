export const renderModal = (content: HTMLElement, onClose: () => void): HTMLElement => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
  
    const modalContent = document.createElement("div");
    modalContent.style.background = "#fff";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "10px";
    modalContent.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    
    modalContent.appendChild(content);
  
    const closeButton = document.createElement("button");
    closeButton.textContent = "Cerrar";
    closeButton.style.marginTop = "10px";
    closeButton.addEventListener("click", () => {
      onClose();
      modal.remove();
    });
  
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
  
    return modal;
  };
  