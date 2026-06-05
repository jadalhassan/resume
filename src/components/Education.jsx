import { SectionHeading } from './About'

const coursework = [
  'Data Structures & Algorithms',
  'Database Management Systems',
  'Operating Systems',
  'Software Engineering',
  'Web Development',
  'Computer Networks',
]

export default function Education() {
  return (
    <section id="education" className="py-24 relative scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading number={1} title="Education" />
        <div
          data-reveal
          style={{ '--reveal-delay': '80ms' }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 hover:border-violet-500/30 hover:bg-white/[7%] transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/5"
        >
          <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
            <div>
              <span className="inline-block px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs font-semibold mb-4">
                Currently Enrolled
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Lebanese American University</h3>
              <p className="text-violet-400 mt-2 font-medium">B.Sc. Computer Science</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-slate-500 text-sm">Aug 2024 - Present</p>
              <p className="text-white font-semibold mt-1">Expected Spring 2027</p>
              <p className="text-violet-300 text-sm font-semibold mt-2">GPA: 3.33</p>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5">
            <p className="text-slate-500 text-xs font-mono tracking-widest uppercase mb-4">Relevant Coursework</p>
            <div className="flex flex-wrap gap-2">
              {coursework.map((course, i) => (
                <span
                  key={course}
                  data-reveal
                  style={{ '--reveal-delay': `${150 + i * 45}ms` }}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-xs sm:text-sm hover:border-violet-500/40 hover:text-violet-300 transition-colors cursor-default"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

