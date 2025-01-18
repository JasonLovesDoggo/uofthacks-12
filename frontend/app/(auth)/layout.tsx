type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default layout;
