'use strict'
/* This is a conversion from libRmath.so to Typescript/Javascript
Copyright (C) 2018  Jacob K.F. Bogers  info@mail.jacob-bogers.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { IRNG } from '../'; 
import { MersenneTwister } from '../mersenne-twister';
import { IRNGNormal } from './inormal-rng';

const a = [
  0.0,
  0.03917609,
  0.07841241,
  0.1177699,
  0.1573107,
  0.1970991,
  0.2372021,
  0.2776904,
  0.3186394,
  0.3601299,
  0.4022501,
  0.4450965,
  0.4887764,
  0.5334097,
  0.5791322,
  0.626099,
  0.6744898,
  0.7245144,
  0.7764218,
  0.8305109,
  0.8871466,
  0.9467818,
  1.00999,
  1.077516,
  1.150349,
  1.229859,
  1.318011,
  1.417797,
  1.534121,
  1.67594,
  1.862732,
  2.153875
];

const d = [
  0.0,
  0.0,
  0.0,
  0.0,
  0.0,
  0.2636843,
  0.2425085,
  0.2255674,
  0.2116342,
  0.1999243,
  0.1899108,
  0.1812252,
  0.1736014,
  0.1668419,
  0.1607967,
  0.1553497,
  0.1504094,
  0.1459026,
  0.14177,
  0.1379632,
  0.1344418,
  0.1311722,
  0.128126,
  0.1252791,
  0.1226109,
  0.1201036,
  0.1177417,
  0.1155119,
  0.1134023,
  0.1114027,
  0.1095039
];

const t = [
  7.673828e-4,
  0.00230687,
  0.003860618,
  0.005438454,
  0.007050699,
  0.008708396,
  0.01042357,
  0.01220953,
  0.01408125,
  0.01605579,
  0.0181529,
  0.02039573,
  0.02281177,
  0.02543407,
  0.02830296,
  0.03146822,
  0.03499233,
  0.03895483,
  0.04345878,
  0.04864035,
  0.05468334,
  0.06184222,
  0.07047983,
  0.08113195,
  0.09462444,
  0.1123001,
  0.136498,
  0.1716886,
  0.2276241,
  0.330498,
  0.5847031
];

const h = [
  0.03920617,
  0.03932705,
  0.03950999,
  0.03975703,
  0.04007093,
  0.04045533,
  0.04091481,
  0.04145507,
  0.04208311,
  0.04280748,
  0.04363863,
  0.04458932,
  0.04567523,
  0.04691571,
  0.04833487,
  0.04996298,
  0.05183859,
  0.05401138,
  0.05654656,
  0.0595313,
  0.06308489,
  0.06737503,
  0.07264544,
  0.07926471,
  0.08781922,
  0.09930398,
  0.1155599,
  0.1404344,
  0.1836142,
  0.2790016,
  0.7010474
];

export class AhrensDieter extends IRNGNormal {
  constructor(_rng: IRNG = new MersenneTwister(0) ) {
    super(_rng);
  }

  protected internal_norm_rand() {
    let u1: number = this.rng.unif_rand() as number;
    let s = 0.0;
    let w;
    let aa;
    let tt;
    let u2;
    let y;
    if (u1 > 0.5) {
      s = 1.0;
    }
    u1 = u1 + u1 - s;
    u1 *= 32.0;

    const i = new Int32Array([u1]);
    if (i[0] === 32) i[0] = 31;
    if (i[0] !== 0) {
      u2 = u1 - i[0];
      aa = a[i[0] - 1];
      while (u2 <= t[i[0] - 1]) {
        u1 = this.rng.unif_rand() as number;
        w = u1 * (a[i[0]] - aa);
        tt = (w * 0.5 + aa) * w;
        for (;;) {
          if (u2 > tt) {
            // this used to be a goto))
            y = aa + w;
            return s === 1.0 ? -y : y;
          }
          u1 = this.rng.unif_rand() as number;
          if (u2 < u1) break;
          tt = u1;
          u2 = this.rng.unif_rand();
        }
        u2 = this.rng.unif_rand();
      }
      w = (u2 - t[i[0] - 1]) * h[i[0] - 1];
    } else {
      i[0] = 6;
      aa = a[31];
      for (;;) {
        u1 = u1 + u1;
        if (u1 >= 1.0) break;
        aa = aa + d[i[0] - 1];
        i[0] = i[0] + 1;
      }
      u1 = (u1 - 1.0) as number;
      // used to be a goto
      jump: for (;;) {
        w = u1 * d[i[0] - 1];
        tt = (w * 0.5 + aa) * w;
        for (;;) {
          u2 = this.rng.unif_rand() as number;
          if (u2 > tt) break jump;
          u1 = this.rng.unif_rand() as number;
          if (u2 < u1) break;
          tt = u1;
        }
        u1 = this.rng.unif_rand() as number;
      }
      //jump:; (goto label)
    }
    // deliver: (goto label)
    y = aa + w;
    return s === 1.0 ? -y : y;
  }
}
