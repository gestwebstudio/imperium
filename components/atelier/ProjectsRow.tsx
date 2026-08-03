"use client";

import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import {
  INFINITE_CAROUSEL_COPIES,
  INFINITE_CAROUSEL_MIDDLE_COPY,
  useInfiniteCarousel,
} from "@/components/ui/useInfiniteCarousel";

/** Проекты — тексты из макета 945:2958. Фото проектов появятся позже (внешние URL). */
type Project = { id: string; title: string; image?: string };

const PROJECTS: Project[] = [
  { id: "s-class", title: "Перешив салона Mercedes-Benz S-Class" },
  { id: "gls", title: "Перешивка салона Mercedes GLS — лучше завода" },
  { id: "x7", title: "Комплексный проект: химчистка, диски и оклейка BMW X7" },
  { id: "911", title: "Защита кузова Porsche 911 керамикой" },
];

function ProjectCard({ title, image }: Project) {
  return (
    <article className="project-card">
      <div className="project-card__body">
        <p className="project-card__title">{title}</p>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="project-card__img" src={image} alt={title} />
        ) : (
          <span className="project-card__placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8.5" cy="8.5" r="2" fill="#6d758f" />
              <path
                d="M3 17.5 8.75 11l4.25 4.75L16.5 12 21 17.5"
                stroke="#6d758f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </article>
  );
}

export function ProjectsRow() {
  const { rowRef, scroll } = useInfiniteCarousel(PROJECTS.length);

  return (
    <section className="home-wrap projects">
      <div className="projects__head">
        <h2 className="projects__title">Проекты, которыми мы гордимся</h2>
      </div>

      <div className="cars-carousel projects-carousel">
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="cars-section__nav"
          aria-label="Предыдущие проекты"
          onClick={() => scroll(-1)}
        />
        <div className="projects-row" ref={rowRef}>
          {INFINITE_CAROUSEL_COPIES.map((copy) =>
            PROJECTS.map((project, index) => {
              const isMiddleCopy = copy === INFINITE_CAROUSEL_MIDDLE_COPY;
              return (
                <div
                  key={`${copy}-${project.id}`}
                  className="projects-carousel__item"
                  data-carousel-cycle-start={index === 0 ? "" : undefined}
                  aria-hidden={isMiddleCopy ? undefined : true}
                  inert={isMiddleCopy ? undefined : true}
                >
                  <ProjectCard {...project} />
                </div>
              );
            }),
          )}
        </div>
        <Button
          size="l"
          variant="secondary-flat"
          iconOnly
          startIcon={<ArrowIcon />}
          className="cars-section__nav cars-section__nav--next"
          aria-label="Следующие проекты"
          onClick={() => scroll(1)}
        />
      </div>
    </section>
  );
}

export default ProjectsRow;
