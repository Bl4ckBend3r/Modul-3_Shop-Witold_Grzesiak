"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var CATEGORIES = [
    {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Lifestyle & running shoes',
        image: '/images/categories/sneakers.jpg',
        exploreInfo: 'Top drops & new colorways',
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Bags, caps & small gear',
        image: '/images/categories/accessories.jpg',
        exploreInfo: 'Complete your fit',
    },
    {
        name: 'Outerwear',
        slug: 'outerwear',
        description: 'Jackets & coats',
        image: '/images/categories/outerwear.jpg',
        exploreInfo: 'Seasonal layers',
    },
];
var BRANDS = [
    { name: 'Aurora', slug: 'aurora', imageUrl: '/images/brands/aurora.png' },
    { name: 'Volt', slug: 'volt', imageUrl: '/images/brands/volt.png' },
    { name: 'Nimbus', slug: 'nimbus', imageUrl: '/images/brands/nimbus.png' },
];
var money = function (n) { return Number((Math.round(n * 100) / 100).toFixed(2)); };
function buildProductBase(i, category, brand) {
    var sku = "".concat(category.slug.toUpperCase(), "-").concat(brand.slug.toUpperCase(), "-").concat(String(i).padStart(3, '0'));
    var name = "".concat(brand.name, " ").concat(category.name, " ").concat(i);
    var slug = "".concat(brand.slug, "-").concat(category.slug, "-").concat(i);
    var price = money(79 + (i % 7) * 20 + Math.random() * 30);
    var stock = 10 + ((i * 3) % 25);
    var imageUrl = "/images/products/".concat(category.slug, "-").concat((i % 5) + 1, ".jpg");
    return { sku: sku, name: name, slug: slug, price: price, stock: stock, imageUrl: imageUrl };
}
function seedBrands() {
    return __awaiter(this, void 0, void 0, function () {
        var brands, _i, BRANDS_1, b, brand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    brands = [];
                    _i = 0, BRANDS_1 = BRANDS;
                    _a.label = 1;
                case 1:
                    if (!(_i < BRANDS_1.length)) return [3 /*break*/, 4];
                    b = BRANDS_1[_i];
                    return [4 /*yield*/, prisma.brand.upsert({
                            where: { slug: b.slug },
                            create: b,
                            update: b,
                            select: { id: true, name: true, slug: true },
                        })];
                case 2:
                    brand = _a.sent();
                    brands.push(brand);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, brands];
            }
        });
    });
}
function seedCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _i, CATEGORIES_1, c, category;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    categories = [];
                    _i = 0, CATEGORIES_1 = CATEGORIES;
                    _a.label = 1;
                case 1:
                    if (!(_i < CATEGORIES_1.length)) return [3 /*break*/, 4];
                    c = CATEGORIES_1[_i];
                    return [4 /*yield*/, prisma.category.upsert({
                            where: { slug: c.slug },
                            create: c,
                            update: c,
                            select: { id: true, name: true, slug: true },
                        })];
                case 2:
                    category = _a.sent();
                    categories.push(category);
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, categories];
            }
        });
    });
}
function seedProducts(categories, brands) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, categories_1, category, count, i, brand, base;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, categories_1 = categories;
                    _a.label = 1;
                case 1:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 6];
                    category = categories_1[_i];
                    count = 5 + Math.floor(Math.random() * 4);
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!(i <= count)) return [3 /*break*/, 5];
                    brand = brands[i % brands.length];
                    base = buildProductBase(i, category, brand);
                    return [4 /*yield*/, prisma.product.upsert({
                            where: { slug: base.slug },
                            create: {
                                sku: base.sku,
                                name: base.name,
                                slug: base.slug,
                                description: "Opis produktu ".concat(base.name, ". Wygoda, styl i trwa\u0142o\u015B\u0107."),
                                price: base.price,
                                stock: base.stock,
                                imageUrl: base.imageUrl,
                                category: { connect: { id: category.id } },
                                brand: { connect: { id: brand.id } },
                                images: {
                                    create: [
                                        { url: base.imageUrl, alt: base.name, position: 0 },
                                        { url: base.imageUrl.replace('.jpg', '_2.jpg'), alt: "".concat(base.name, " alt"), position: 1 },
                                    ],
                                },
                            },
                            update: {
                                name: base.name,
                                price: base.price,
                                stock: base.stock,
                            },
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function seedUserWithAddress() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.upsert({
                        where: { email: 'test@example.com' },
                        create: {
                            email: 'test@example.com',
                            firstName: 'Test',
                            lastName: 'User',
                            passwordHash: 'plain:password', // UWAGA: tylko demo, w realu bcrypt!
                            addresses: {
                                create: [
                                    {
                                        line1: 'Tadeusza Konicza 7',
                                        city: 'Zielona Góra',
                                        postal: '65-001',
                                        country: 'PL',
                                        isDefault: true,
                                    },
                                ],
                            },
                        },
                        update: {},
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var brands, categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Seeding...');
                    return [4 /*yield*/, seedBrands()];
                case 1:
                    brands = _a.sent();
                    return [4 /*yield*/, seedCategories()];
                case 2:
                    categories = _a.sent();
                    return [4 /*yield*/, seedProducts(categories, brands)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, seedUserWithAddress()];
                case 4:
                    _a.sent();
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
