import './NotFoundPage.css'
import phoneImg from '../../assets/Hande.jpg' // заміни на свою картинку

export default function NotFoundPage() {
  return (
    <div className="nf-wrapper">
      {/* LEFT SIDE — IMAGE */}
      <div className="nf-left">
        <img src={phoneImg} alt="404" className="nf-image" />
      </div>

      {/* RIGHT SIDE — TEXT */}
      <div className="nf-right">
        <h1 className="nf-title">Oops! Page Not Found (404 Error)</h1>

        <p className="nf-text">
          We're sorry, but the page you're looking for doesn't seem to exist.
        </p>

        <p className="nf-text">
          If you typed the URL manually, please double‑check the spelling.
        </p>

        <p className="nf-text">
          If you clicked on a link, it may be outdated or broken.
        </p>
      </div>
    </div>
  )
}
