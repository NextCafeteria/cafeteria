import { useTranslation } from "@/app/i18n/client";

export default function ConfirmModal({
  lng,
  title,
  msg,
  handleConfirm,
  modalRef,
}) {
  const { t } = useTranslation(lng, "common");
  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal rounded-md">
      <form method="dialog" className="modal-box bg-white">
        <h3 class="font-bold text-lg">{t(`${title}`)}</h3>
        <p class="py-4">{t(`${msg}`)}</p>
        <div class="modal-action">
          <button onClick={handleConfirm} class="btn btn-primary">
            Yes
          </button>
          <button onClick={() => modalRef.current.close()} class="btn">
            Cancel
          </button>
        </div>
      </form>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
