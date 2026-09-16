import { projects, flagship, upcoming } from "./projects";
import type { Configuration, Project, Unit, UnitStatus } from "./types";

/**
 * Data access seam.
 *
 * Everything the UI needs goes through these functions. Today they read from
 * the bundled demo records; tomorrow they can `fetch()` a CMS, a property
 * database or a CRM without any component changing.
 */

export function listProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFlagship(): Project {
  return flagship;
}

export function getUpcoming() {
  return upcoming;
}

export function listResidences(project: Project = flagship) {
  return project.residences;
}

export function getResidence(id: string, project: Project = flagship) {
  return project.residences.find((r) => r.id === id);
}

export function listUnits(
  filters: {
    configuration?: Configuration | "all";
    status?: UnitStatus | "all";
    project?: Project;
  } = {},
): Unit[] {
  const { configuration = "all", status = "all", project = flagship } = filters;
  return project.units.filter(
    (u) =>
      (configuration === "all" || u.configuration === configuration) &&
      (status === "all" || u.status === status),
  );
}

export function availableCount(configuration: Configuration, project: Project = flagship): number {
  return project.units.filter((u) => u.configuration === configuration && u.status === "available")
    .length;
}

/** Availability position for one project, derived from its own unit sheet. */
export function projectAvailability(project: Project) {
  const count = (status: UnitStatus) => project.units.filter((u) => u.status === status).length;
  return {
    total: project.units.length,
    available: count("available"),
    reserved: count("reserved"),
    sold: count("sold"),
  };
}

/** Portfolio position across all six projects. */
export function portfolioSummary() {
  const units = projects.flatMap((p) => p.units);
  return {
    projects: projects.length,
    residences: projects.reduce((sum, p) => sum + p.totalResidences, 0),
    available: units.filter((u) => u.status === "available").length,
    delivered: "24 projects · 8.2M sq.ft.",
  };
}
