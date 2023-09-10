type DistanceProps = {
  leg: google.maps.DirectionsLeg;
};

export default function Distance({ leg }: DistanceProps) {
  if (!leg.distance || !leg.duration) return null;

  return (
    <div>
      <p>
        This attraction is <span className="highlight">{leg.distance.text}</span> away
        from your hotel. 
        
        That would take{" "}
        <span className="highlight">{leg.duration.text}</span> each direction.
      </p>
    </div>
  );
}
