export const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content border-t border-base-300">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span>Developed by</span>
          <a
            href="https://github.com/mdrafee03"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary font-semibold hover:underline"
          >
            Md Rafee
          </a>
        </div>
        <div className="text-sm opacity-70">
          <span>MIT License • </span>
          <a
            href="https://github.com/mdrafee03/ocpp-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary hover:underline"
          >
            View Source
          </a>
        </div>
      </div>
    </footer>
  );
};
