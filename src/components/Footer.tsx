export const Footer = () => {
  return (
    <footer className="footer footer-center p-2 bg-base-300 text-base-content border-t border-base-300">
      <div className="flex items-center gap-2 text-sm">
        <span>Developed by</span>
        <a
          href="https://github.com/mdrafee03"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary font-semibold hover:underline"
        >
          Md Rafee
        </a>
        <span>•</span>
        <span>MIT License</span>
        <span>•</span>
        <a
          href="https://github.com/mdrafee03/ocpp-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary hover:underline"
        >
          View Source
        </a>
      </div>
    </footer>
  );
};
