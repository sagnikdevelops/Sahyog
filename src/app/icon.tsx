import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#142D52',
        borderRadius: 8,
        border: '1.5px solid #047857',
      }}
    >
      <img src="/images/logo.png" width={24} height={24} style={{ objectFit: 'contain' }} alt="Sahyog" />
    </div>
    ),
    {
      ...size,
    }
  );
}
