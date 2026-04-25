import { Link } from 'react-router-dom';

const categoryChip = {
  'Core Logic':      { bg:'rgba(152,219,198,0.2)', color:'#1c6251' },
  'Neural Nets':     { bg:'rgba(206,201,255,0.25)', color:'#565381' },
  'System Integrity':{ bg:'rgba(245,195,179,0.25)', color:'#744e42' },
  'Synthesis':       { bg:'rgba(179,229,252,0.25)', color:'#01579b' },
};
const levelColors = { Beginner:'#1c6251', Intermediate:'#565381', Advanced:'#744e42' };

const CourseCard = ({ course, enrollment }) => {
  const chip = categoryChip[course.category] || { bg:'rgba(152,219,198,0.2)', color:'#1c6251' };
  const progress = enrollment?.progress ?? null;

  return (
    <Link to={`/courses/${course._id}`} style={{ textDecoration:'none' }}>
      <div className="course-card">
        {/* Thumbnail */}
        <div style={{ aspectRatio:'16/9', overflow:'hidden', background:'var(--primary-container)', position:'relative' }}>
          {course.thumbnail
            ? <img src={course.thumbnail} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                onMouseEnter={e=>e.target.style.transform='scale(1.06)'}
                onMouseLeave={e=>e.target.style.transform='scale(1)'} />
            : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:64, color:'var(--on-primary-container)', opacity:0.4 }}>school</span>
              </div>
          }
          {course.price === 0 && (
            <span style={{ position:'absolute', top:12, right:12, background:'var(--primary)',
              color:'white', fontSize:11, fontWeight:800, padding:'4px 12px',
              borderRadius:9999, letterSpacing:'0.05em' }}>FREE</span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ background:chip.bg, color:chip.color, fontSize:11, fontWeight:700,
              padding:'5px 12px', borderRadius:9999, letterSpacing:'0.05em' }}>
              {course.category}
            </span>
            <span style={{ fontSize:11, fontWeight:700, color:levelColors[course.level] || 'var(--outline)',
              textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {course.level}
            </span>
          </div>

          <h3 style={{ fontWeight:700, fontSize:16, lineHeight:1.4, marginBottom:8,
            color:'var(--on-surface)', display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {course.title}
          </h3>
          <p style={{ fontSize:13, color:'var(--on-surface-variant)', lineHeight:1.5, marginBottom:16,
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {course.shortDescription || course.description}
          </p>

          {/* Instructor */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--secondary-container)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:700, color:'var(--on-secondary-container)', overflow:'hidden', flexShrink:0 }}>
              {course.instructor?.avatar
                ? <img src={course.instructor.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : course.instructor?.name?.charAt(0)}
            </div>
            <span style={{ fontSize:13, color:'var(--outline)', fontWeight:600 }}>{course.instructor?.name}</span>
          </div>

          {/* Progress bar (enrolled) */}
          {progress !== null && (
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:11, fontWeight:700, color:'var(--outline)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Progress</span>
                <span style={{ fontSize:11, fontWeight:800, color:'var(--primary)' }}>{progress}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width:`${progress}%` }} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12,
            borderTop:'1px solid var(--surface-container)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span className="material-symbols-outlined" style={{ fontSize:16, color:'#f59e0b' }}>star</span>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--on-surface)' }}>
                {course.rating?.average?.toFixed(1) || '—'}
              </span>
              <span style={{ fontSize:12, color:'var(--outline)' }}>({course.rating?.count || 0})</span>
            </div>
            <span style={{ fontSize:15, fontWeight:800,
              color: course.price === 0 ? 'var(--primary)' : 'var(--on-surface)' }}>
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
