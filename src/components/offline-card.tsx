import { useEffect, useState } from "react";
import { useOfflineState } from "@/components/offline-boot";

export function OfflineCard() {
  const { status, persisted } = useOfflineState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const note =
    !mounted
      ? null
      : status === "ready"
        ? persisted
          ? "Buk i stap pinis long fon. Yu ken ritim, maski intanet i no stap."
          : "Buk i stap long fon. Sapos fon i pulap tumas, em inap rausim sampela hap. Putim app long pes namba wan bilong fon i helpim."
        : status === "unsupported"
          ? "Dispela fon i no inap holim buk nating intanet. Yusim Chrome o Safari na putim long pes namba wan."
          : status === "error"
            ? "Nogat hap long holim buk long fon. Traim gen taim intanet i gutpela."
            : status === "dev"
              ? "Long fon, opim app wanpela taim wantaim intanet. Bihain i wok, maski intanet i no stap."
              : "I wok long putim ol rit long fon…";

  return (
    <div className="rounded-md bg-paper-2 px-3 py-3">
      <p className="font-medium">Buk long fon</p>
      <p className="mt-1 text-xs leading-snug text-muted">
        Opim wanpela taim wantaim intanet. Bihain olgeta misa, rit na kalenda i stap long fon — yu no nidim
        intanet.
      </p>
      {note ? <p className="mt-1.5 text-xs leading-snug text-muted">{note}</p> : null}
    </div>
  );
}
