import React, {ReactChild} from 'react';

interface Props {
  children: ReactChild;
  href: string;
  title?: string;
  download?: string;
}

export default function DownloadLink (
  {children, href, title = '', download = ''}: Props
) {
  return (
    <a
      className="bg-primary px-2 py-1 ml-3 rounded-md text-neutral-100 drop-shadow-lg hover:drop-shadow-md hover:text-secondary-100 transition ease-in-out"
      href={href}
      download={download}
      title={title}
    >
      {children}
    </a>
  );
}
