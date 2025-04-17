export interface FooterLink {
  label: string;
  href: string;
  icon?: React.ReactElement;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
