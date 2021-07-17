var choropleths = {
    choroMargins: function(district) {
        var parties = [district.properties.DemPct, district.properties.RepPct];
        parties.sort(function(a, b) {
            return b - a;
        });

        var margin = parties[0] - parties[1];

        if (margin >= 0.15) {
            return 1;
        } else {
            if (margin >= 0.05) {
                return 0.75;
            } else {
                if (margin >= 0.01) {
                    return 0.4;
                } else {
                    if (margin <= 0.01) {
                        return 0.2;
                    }
                }
            }
        }
    },

    choroDynamic: function(district) {
        var parties = [district.properties.DemPct, district.properties.RepPct];
        parties.sort(function(a, b) {
            return b - a;
        });

        var margin = parties[0] - parties[1];

        if (margin > 0.05) {
            return Math.pow(margin, 1.3) + 0.35;
        } else {
            return Math.pow(margin, 1.3) + 0.25;
        }
    },
}
