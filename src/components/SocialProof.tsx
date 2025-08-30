const SocialProof = () => {
  // Generate placeholder avatars with different background colors
  const avatars = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    initials: String.fromCharCode(65 + i) + String.fromCharCode(65 + (i + 1) % 26),
    bgColor: `hsl(${(i * 72) % 360}, 70%, 60%)`,
  }));

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div className="flex -space-x-2">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: avatar.bgColor }}
          >
            {avatar.initials}
          </div>
        ))}
      </div>
      <p className="text-white/80 text-sm font-medium">
        163+ analysis made
      </p>
    </div>
  );
};

export default SocialProof;