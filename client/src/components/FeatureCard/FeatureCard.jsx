const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center border border-light-gray group hover:border-accent-orange/20">
    <div className="text-accent-orange text-3xl mb-4 p-3 bg-light-gray rounded-full group-hover:bg-accent-orange/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-dark-blue font-semibold text-lg mb-2 text-center">
      {title}
    </h3>
    <p className="text-dark-blue/80 text-sm text-center leading-relaxed">
      {description}
    </p>
  </div>
);

export default FeatureCard;
