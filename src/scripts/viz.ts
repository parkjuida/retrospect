// 시각화 컴포넌트들이 같이 쓰는 도구.

export type Point = { x: number; y: number };

/** 같은 seed면 같은 난수열을 돌려준다 (mulberry32). "새 데이터"를 눌러도 재현 가능하게. */
export function seededRandom(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/** SVG 클릭 위치를 viewBox 좌표로 바꾼다 */
export function toViewBox(svg: SVGSVGElement, e: MouseEvent): Point {
	const rect = svg.getBoundingClientRect();
	const { width, height } = svg.viewBox.baseVal;
	return { x: ((e.clientX - rect.left) / rect.width) * width, y: ((e.clientY - rect.top) / rect.height) * height };
}

export const squaredDistance = (a: Point, b: Point) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

/** 몇 군데에 뭉친 점들 + 흩어진 점들. 실제 임베딩처럼 고르지 않은 분포를 흉내 낸다. */
export function blobPoints(opts: { seed: number; width: number; height: number; pad: number; blobs: number; perBlob: [number, number]; spread: [number, number]; noise: number }) {
	const { seed, width, height, pad, blobs, perBlob, spread, noise } = opts;
	const r = seededRandom(seed);
	const gauss = () => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
	const clamp = (v: number, max: number) => Math.min(max - pad, Math.max(pad, v));
	const pts: Point[] = [];
	for (let b = 0; b < blobs; b++) {
		const bx = pad + 50 + r() * (width - 2 * pad - 100);
		const by = pad + 40 + r() * (height - 2 * pad - 80);
		const sx = spread[0] + r() * (spread[1] - spread[0]);
		const sy = spread[0] + r() * (spread[1] - spread[0]);
		const n = perBlob[0] + Math.floor(r() * (perBlob[1] - perBlob[0]));
		for (let i = 0; i < n; i++) pts.push({ x: clamp(bx + gauss() * sx, width), y: clamp(by + gauss() * sy, height) });
	}
	for (let i = 0; i < noise; i++) pts.push({ x: pad + r() * (width - 2 * pad), y: pad + r() * (height - 2 * pad) });
	return pts;
}

/** 2차원 k-means (k-means++로 시작점 선택) */
export function kmeans(pts: Point[], k: number, seed: number, iterations = 25) {
	const r = seededRandom(seed);
	let centroids: Point[] = [{ ...pts[Math.floor(r() * pts.length)] }];
	while (centroids.length < k) {
		const d = pts.map((p) => Math.min(...centroids.map((c) => squaredDistance(p, c))));
		let t = r() * d.reduce((a, b) => a + b, 0);
		let i = 0;
		while (i < d.length - 1 && t > d[i]) t -= d[i++];
		centroids.push({ ...pts[i] });
	}
	const nearest = (p: Point) => centroids.reduce((best, c, j) => (squaredDistance(p, c) < squaredDistance(p, centroids[best]) ? j : best), 0);
	for (let iter = 0; iter < iterations; iter++) {
		const sum = centroids.map(() => ({ x: 0, y: 0, n: 0 }));
		for (const p of pts) {
			const s = sum[nearest(p)];
			s.x += p.x;
			s.y += p.y;
			s.n++;
		}
		centroids = centroids.map((c, j) => (sum[j].n ? { x: sum[j].x / sum[j].n, y: sum[j].y / sum[j].n } : c));
	}
	return { centroids, assign: pts.map(nearest) };
}

/** 1차원 k-means. 분위수에서 시작해서 결과가 안정적이다. */
export function kmeans1d(values: number[], k: number, iterations = 30) {
	const sorted = [...values].sort((a, b) => a - b);
	let centers = Array.from({ length: k }, (_, i) => sorted[Math.floor(((i + 0.5) * sorted.length) / k)]);
	const nearest = (v: number) => centers.reduce((best, c, j) => (Math.abs(v - c) < Math.abs(v - centers[best]) ? j : best), 0);
	for (let iter = 0; iter < iterations; iter++) {
		const sum = Array(k).fill(0);
		const n = Array(k).fill(0);
		for (const v of values) {
			const j = nearest(v);
			sum[j] += v;
			n[j]++;
		}
		centers = centers.map((c, j) => (n[j] ? sum[j] / n[j] : c));
	}
	return centers.sort((a, b) => a - b);
}

/** list 중 v에 가장 가까운 값 */
export const nearestValue = (v: number, list: number[]) => list.reduce((a, b) => (Math.abs(v - b) < Math.abs(v - a) ? b : a));
